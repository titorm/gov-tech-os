# Mobile images original backups (base64)

This file contains base64 encodings of the original PNG files that were replaced in `apps/mobile/assets/images/` as part
of a build-unblocking fix. Each section contains a marker header and the base64 payload so the original file can be
restored if needed.

---FILE: /tmp/mobile-images-backup-20250919-230322/adaptive-icon.png---
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3a
AAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=

---FILE: /tmp/mobile-images-backup-20250919-230322/favicon.png---
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3a
AAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=

---FILE: /tmp/mobile-images-backup-20250919-230322/icon.png---
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3a
AAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=

---FILE: /tmp/mobile-images-backup-20250919-230322/splash.png---
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3a
AAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=

---FILE: /tmp/mobile-images-backup-20250919-230442/adaptive-icon.png---
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3a
AAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=

---FILE: /tmp/mobile-images-backup-20250919-230442/favicon.png---
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3a
AAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=

---FILE: /tmp/mobile-images-backup-20250919-230442/icon.png---
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3a
AAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=

---FILE: /tmp/mobile-images-backup-20250919-230442/splash.png---
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3a
AAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=

## How to restore

To restore a file, copy the corresponding base64 block, decode and overwrite the file. Example:

```bash
# restore the icon.png from the first backup block
echo "iVBORw0K..." | base64 --decode > apps/mobile/assets/images/icon.png
```

Note: On macOS the `base64` utility has different flags; use `openssl base64 -d -in -` if necessary:

```bash
echo "iVBORw0K..." | openssl base64 -d -out apps/mobile/assets/images/icon.png
```
