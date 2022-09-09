# -*- mode: python ; coding: utf-8 -*-


block_cipher = None


a = Analysis(
    ['D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\src\\services\\Main.py'],
    pathex=[],
    binaries=[],
    datas=[
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\generation\\concept_id_dict.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\all_ancestors_dimension_divided.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\all_hyponyms.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\all_hyponyms_dimension_divided.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\ancestors.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\concept_information_content_yuan2013.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\direct_ancestors.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\direct_ancestors_dimension_divided.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\Lancestors.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\Lconcept_information_content_yuan2013.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\Ldirect_Ancestor.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\Lneighbors.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\Lontologies.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\neighbors.json','.'),
('D:\\documents\\PycharmProjects\\server\\server\\querywmslist_server_flask\\MDL_RM\\src\\main\\samples\\input\\neighbors_dimension_divided.json','.')
],
    hiddenimports=['pymysql'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='Main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
