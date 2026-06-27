# UI Release Process

The Raspberry Pi 2 should not build the Vue maintenance UI. Build the UI on the development machine, commit the generated files into a deploy-only repository, then let the Pi pull those files and copy them into Lighttpd.

## Repositories

- Source repository: `fcb1010`
- Deploy repository: `fcb-maintenance-ui-dist`

The deploy repository contains only the generated UI files from `maintenance/dist`, plus a small `version.json` file.

## Build And Publish From Windows

From the source repository:

```powershell
.\maintenance\release-ui.ps1
```

This builds `maintenance/dist`, copies it into `D:\V\Projects\fcb-maintenance-ui-dist`, writes `version.json`, and creates a local commit in the deploy repository.

After the GitHub deploy repository exists, publish with:

```powershell
.\maintenance\release-ui.ps1 -Push
```

The script uses `NODE_OPTIONS=--openssl-legacy-provider` because the current Vue CLI/Webpack stack needs it on newer Node versions.

## First-Time Setup On RPi

Create a Pi-owned clone outside the web root:

```bash
cd /home/pi
git clone https://github.com/vldp2000/fcb-maintenance-ui-dist.git
```

Deploy to Lighttpd:

```bash
cd /home/pi/fcb-maintenance-ui-dist
git pull
sudo rsync -a --delete ./ /var/www/html/
sudo chown -R www-data:www-data /var/www/html
sudo systemctl restart lighttpd
```

## Normal RPi Update

```bash
cd /home/pi/fcb-maintenance-ui-dist
git pull
sudo rsync -a --delete ./ /var/www/html/
sudo chown -R www-data:www-data /var/www/html
sudo systemctl restart lighttpd
```

If the browser still shows the previous UI, unregister the old service worker or clear the site data for `http://midipi/gigcontrol`.
