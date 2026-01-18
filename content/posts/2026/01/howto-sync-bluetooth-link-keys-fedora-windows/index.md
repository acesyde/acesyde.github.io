---
title: "Dual-Booting Fedora and Windows: How to Sync Bluetooth Link Keys Without Leaving Linux"
date: 2026-01-15T00:00:00+02:00
tags: ["fedora", "windows", "bluetooth", "linux", "dual-boot"]
categories: ["home"]
showToc: false
cover:
  image: "logo.jpg"
  alt: "Fedora and Windows Dual-Boot Bluetooth Sync"
  title: "Sync Bluetooth Link Keys Between Fedora and Windows"
  relative: false
---

If you are a dual-boot user running **Fedora 43** and **Windows**, you have certainly encountered this frustrating issue: you pair your Bluetooth soundbar on Linux, then on Windows, but when you return to Linux, the connection is lost.

> **Disclaimer:** The MAC addresses and the Link Key used in this tutorial (e.g., `88:C9:E8...` and `A5AF8E...`) are **fictional examples**. You must identify and use the specific values belonging to your own hardware.

## The Problem Explanation

The technical reason is simple: your Bluetooth hardware has a unique MAC address. When you pair a device, a **Link Key** (a unique security token) is generated. Windows and Linux each create their own different key. The soundbar, seeing the same MAC address but a different key, rejects the connection for security reasons.

To solve this, we must force Linux to use the exact same Link Key as Windows. Here is how to do it **100% from Linux**, without needing to reboot into Windows.

---

## 1. Install the Necessary Tools

We need to access the Windows Registry files while they are "offline." We will use `chntpw` (a tool to modify the Windows SAM/Registry) and `ntfs-3g` to mount the partition.

On Fedora, open your terminal and run:

```bash
sudo dnf install chntpw ntfs-3g

```

---

## 2. Mount the Windows Partition

First, identify your Windows partition (look for the NTFS drive) using `lsblk`. Then, mount it in read-only mode to ensure data safety.

```bash
sudo mkdir -p /mnt/windows
# Replace /dev/nvme0n1p3 with your actual partition name
sudo mount -t ntfs-3g -o ro /dev/nvme0n1p3 /mnt/windows

```

---

## 3. Locate the Keys in the Windows Registry

Windows stores Bluetooth keys in a binary hive located at `C:\Windows\System32\config\SYSTEM`.

Navigate to the directory and open the registry editor:

```bash
cd /mnt/windows/Windows/System32/config
sudo chntpw -e SYSTEM

```

Once the interactive prompt (`>`) appears, navigate to the Bluetooth parameters:

```text
> cd \ControlSet001\Services\BTHPORT\Parameters\Keys
> ls

```

You will see a subkey named after your PC's Bluetooth adapter MAC address. Enter that folder:

```text
> cd [YOUR_ADAPTER_MAC]
> ls

```

---

## 4. Extract the Link Key with 'hex'

You will now see the MAC addresses of your paired devices. To get the key for your soundbar, use the `hex` command followed by the device MAC address:

```text
> hex 88c9e8bb6d14

```

The output will display a series of 16 bytes.
**Example output:** `A5 AF 8E 19 BA C8 CE F3 F0 F2 ED 6B DC 9A CF 4B`

**Copy this string and remove the spaces.** This is your Windows Link Key.

---

## 5. Update the Linux Bluetooth Configuration

Now we must inject this key into Fedora's configuration files. Linux stores these in `/var/lib/bluetooth/`. Note that Linux directory names use **upper case** and **colons** for MAC addresses.

Open the `info` file for your device:

```bash
sudo nano /var/lib/bluetooth/[ADAPTER_MAC]/[DEVICE_MAC]/info

```

Find the `[LinkKey]` section and update it with your Windows key:

```ini
[LinkKey]
Key=A5AF8E19BAC8CEF3F0F2ED6BDC9ACF4B
Type=4
PINLength=0

```

---

## 6. Test the Connection

To apply the changes, you must restart the Bluetooth service so it reloads the modified configuration file:

```bash
sudo systemctl restart bluetooth

```

Now, try to connect to your soundbar:

```bash
bluetoothctl connect [DEVICE_MAC]

```

If it connects successfully, you can now switch between Fedora and Windows without ever needing to re-pair your audio equipment again. Finally, do not forget to unmount your Windows partition:

```bash
sudo umount /mnt/windows

```
