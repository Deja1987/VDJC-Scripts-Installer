Instalador de scripts VDJC para MIXXX

Este instalador ofrece la configuracion de Windows para scripts, mapeos y utilidades necesarias para usar VDJC Virtual DJ Controller con MIXXX.

Requisito importante
MIXXX debe estar instalado antes de ejecutar este instalador. El instalador no instala MIXXX.

Que hace este instalador
- Instala los archivos de mapeo VDJC en la carpeta controllers de MIXXX
- Instala el script JavaScript del controlador de MIXXX
- Instala un script PowerShell de apoyo
- Crea un acceso directo en el escritorio para ejecutar el script

Que hace el script PowerShell
- Localiza el directorio de configuracion de MIXXX
- Lee archivos de configuracion de efectos como effects.xml
- Extrae Chain Effect Presets, Quick Effect Presets y Available Effects
- Regenera las listas de presets/efectos en el archivo JavaScript de VDJC
- Mantiene VDJC sincronizado con la configuracion de MIXXX
- Inicia MIXXX al finalizar la actualizacion

Requisitos
- Windows 10 o Windows 11
- MIXXX instalado previamente
- PowerShell (incluido en Windows)

Instalacion
1. Asegurate de que MIXXX ya este instalado.
2. Descarga el instalador exe desde la seccion Releases.
3. Ejecuta el instalador y sigue las instrucciones.
4. Usa el acceso directo del escritorio (si se instala) para actualizar presets e iniciar MIXXX.
5. En MIXXX, selecciona el mapeo VDJC desde la configuracion de controladores.

Desinstalacion
La desinstalacion elimina mappings VDJC, archivos de apoyo, accesos directos y datos runtime de VDJC.
No elimina MIXXX ni la configuracion personal.

Licencia
Este proyecto se publica bajo licencia MIT.

Trademark Notice
"VDJC", "VDJC Project" y nombres, logotipos e identidades visuales relacionados son marcas de VDJC Project.
La licencia MIT solo aplica al codigo fuente de este repositorio y no concede permiso para usar el nombre VDJC, el branding o los logotipos en obras derivadas, productos comerciales o redistribuciones sin consentimiento escrito.
