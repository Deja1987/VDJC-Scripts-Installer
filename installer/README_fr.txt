Installateur de scripts VDJC pour MIXXX

Cet installateur fournit la configuration Windows pour scripts, mappages et utilitaires necessaires pour utiliser VDJC Virtual DJ Controller avec MIXXX.

Exigence importante
MIXXX doit etre installe avant d'executer cet installateur. L'installateur n'installe pas MIXXX.

Ce que fait cet installateur
- Installe les fichiers de mappage VDJC dans le dossier controllers de MIXXX
- Installe le script JavaScript du controleur MIXXX
- Installe un script PowerShell de support
- Cree un raccourci sur le bureau pour executer le script

Ce que fait le script PowerShell
- Localise le dossier de configuration de MIXXX
- Lit les fichiers de configuration des effets comme effects.xml
- Extrait Chain Effect Presets, Quick Effect Presets et Available Effects
- Regenere les listes de presets/effets dans le fichier JavaScript VDJC
- Maintient VDJC synchronise avec la configuration MIXXX
- Lance MIXXX a la fin de la mise a jour

Exigences
- Windows 10 ou Windows 11
- MIXXX deja installe
- PowerShell (inclus dans Windows)

Installation
1. Assurez-vous que MIXXX est deja installe.
2. Telechargez l'installateur exe depuis la section Releases.
3. Lancez l'installateur et suivez les instructions.
4. Utilisez le raccourci bureau (si installe) pour mettre a jour les presets et lancer MIXXX.
5. Dans MIXXX, selectionnez le mapping VDJC dans les parametres du controleur.

Desinstallation
La desinstallation supprime mappings VDJC, fichiers de support, raccourcis et donnees runtime VDJC.
Elle ne supprime pas MIXXX ni les reglages personnels.

Licence
Ce projet est publie sous licence MIT.

Trademark Notice
"VDJC", "VDJC Project" et les noms, logos et identites visuelles associes sont des marques du VDJC Project.
La licence MIT ne s'applique qu'au code source de ce depot et ne donne pas l'autorisation d'utiliser le nom VDJC, la marque ou les logos dans des oeuvres derivees, produits commerciaux ou redistributions sans consentement ecrit.
