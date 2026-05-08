import glob, os

os.chdir('e:/Website/premiumdowngrade/projects')

for f in sorted(glob.glob('project_*/project.json')):
    c = open(f, encoding='utf-8').read()
    changed = False
    
    # 1. Fix nav links: ../?id= -> ../project/?id=
    if '../?id=' in c:
        c = c.replace('../?id=', '../project/?id=')
        changed = True
    
    # 2. Fix project_03: heroVideo and gallery references to project_02.webm -> project_03.webm
    if f == 'project_03\\project.json' or f == 'project_03/project.json':
        c = c.replace('project_02.webm', 'project_03.webm')
        changed = True
    
    if changed:
        open(f, 'w', encoding='utf-8').write(c)
        print(f'FIXED: {f}')
    else:
        print(f'OK:    {f}')

print('Fertig!')
