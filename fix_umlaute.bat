@echo off
cd /d "e:\Website\premiumdowngrade"
echo Fixe Umlaute in project.json Dateien...
echo.

python -c "import glob; r={'Ã¤':'ä','Ã¶':'ö','Ã¼':'ü','Ã„':'Ä','Ã–':'Ö','Ãœ':'Ü','ÃŸ':'ß','Ã©':'é','â€“':'–','â€”':'—','â€':'–','â„¢':'™'}; [print(f'Korrigiere: {f}') or open(f,'w',encoding='utf-8').write(open(f,encoding='utf-8').read().translate(str.maketrans(r))) if any(c in open(f,encoding='utf-8').read() for c in r) else print(f'OK: {f}') for f in sorted(glob.glob('projects/**/project.json',recursive=True))]"

echo.
echo Fertig! Alle Umlaute korrigiert.
pause
