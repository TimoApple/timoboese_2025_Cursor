import glob
for f in ["index.html", "project/index.html"]:
    c = open(f, encoding="utf-8").read()
    old = '    <link rel="icon" href="favicon.svg" type="image/svg+xml">'
    new = old + '\n    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">\n    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16x16.png">\n    <link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon.png">\n    <link rel="manifest" href="assets/favicon/site.webmanifest">'
    if old in c:
        c = c.replace(old, new)
        open(f, "w", encoding="utf-8").write(c)
        print(f"OK: {f}")
    else:
        print(f"SKIP: {f}")
print("Fertig!")
