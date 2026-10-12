import urllib.request, urllib.parse, re, socket, os, http.cookiejar
socket.setdefaulttimeout(120)
CJ = http.cookiejar.CookieJar()
OP = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CJ))
OP.addheaders = [("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64)")]

def _html(h):
    return h.lstrip()[:400].lower().startswith(b"<!doctype html") or h.lstrip()[:200].lower().startswith(b"<html")

def get(fid, dest, retries=3):
    """Robust Drive download: handles the virus-scan confirm form."""
    url = f"https://drive.google.com/uc?export=download&id={fid}"
    for attempt in range(retries):
        data = OP.open(url).read()
        if b"Virus scan warning" in data[:3000] or b"drive.usercontent.google.com/download" in data[:6000]:
            h = data.decode("utf-8","replace")
            m = re.search(r'<form[^>]+action="([^"]+)"[^>]*>(.*?)</form>', h, re.S)
            if m:
                action = m.group(1).replace("&amp;","&")
                params = urllib.parse.parse_qs(urllib.parse.urlparse(action).query)
                for name, val in re.findall(r'<input[^>]+type="hidden"[^>]+name="([^"]+)"[^>]+value="([^"]*)"', m.group(2)):
                    params[name] = [val]
                for name, val in re.findall(r'<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"[^>]+type="hidden"', m.group(2)):
                    params[name] = [val]
                params.setdefault("export", ["download"]); params.setdefault("id", [fid])
                q = {k: v[0] for k, v in params.items()}
                base = action.split("?")[0]
                data = OP.open(base + "?" + urllib.parse.urlencode(q)).read()
        if _html(data) and len(data) < 200000 and (b"Virus scan" in data or b"Sign in" in data):
            url = f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
            continue
        os.makedirs(os.path.dirname(dest) or ".", exist_ok=True)
        with open(dest,"wb") as f: f.write(data)
        return len(data)
    raise RuntimeError("download blocked: "+dest)

def ls(fid):
    h = OP.open(f"https://drive.google.com/embeddedfolderview?id={fid}#list").read().decode("utf-8","replace")
    out = []
    for m in re.finditer(r'<a href="https://drive.google.com/(file/d|drive/folders)/([A-Za-z0-9_-]+)[^"]*"[^>]*>.*?<div class="flip-entry-title">(.*?)</div>', h, re.S):
        out.append((m.group(3), m.group(2), m.group(1) == "drive/folders"))
    return out

def walk(fid, path, depth=0, only=None, skip_dirs=(), skip_subtrees=()):
    for name, i, isdir in ls(fid):
        p = os.path.join(path, name)
        if isdir:
            if name in skip_dirs or name in skip_subtrees:
                continue
            walk(i, p, depth+1, only, skip_dirs, skip_subtrees)
        else:
            if only and not any(k.lower() in name.lower() for k in only):
                continue
            try:
                n = get(i, p)
                if name.endswith(".json") or True:
                    pass
                print(f"  ok {n:>10,d}  {p}")
            except Exception as e:
                print(f"  FAIL {p}: {e}")
