import glob, os
os.chdir('e:/Website/premiumdowngrade/projects')
for f in glob.glob('project_*/project.json'):
    c = open(f, encoding='utf-8').read()
    c = c.replace('../?id=', '../project/?id=')
    open(f, 'w', encoding='utf-8').write(c)
    print(f'OK: {f}')
print('Fertig!')
