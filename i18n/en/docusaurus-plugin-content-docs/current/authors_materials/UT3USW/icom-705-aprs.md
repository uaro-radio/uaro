---
title: APRS on the ICOM IC-705
description: Setting up SoundModem and PinPoint APRS to work with the ICOM IC-705 on Windows.
tags: [ham, icom, aprs, soundmodem]
---

# APRS on the ICOM IC-705

Source: [UT3USW's personal blog](https://ut3usw.dead.guru/docs/ham/icom-705-aprs)

## Introduction

**APRS** (Automatic Packet Reporting System) is a data transmission system used in radio to
track and exchange information with mobile, fixed and portable stations. APRS was developed
by Bob Bruninga, [WB4APR](http://www.arrl.org/news/aprs-developer-bob-bruninga-wb4apr-sk),
and became popular among radio amateurs.

![4341aa17842946c98355452168a9570d.png](@site/docs/authors_materials/UT3USW/img/4341aa17842946c98355452168a9570d.png)

**APRS** uses packet data switching, where short packets of information are sent over the
air to specified stations in real time. These packets can carry all sorts of information —
location coordinates, speed, direction of travel, weather conditions, messages and so on.

![https://aprs-map.info](@site/docs/authors_materials/UT3USW/img/h_pe_h7_p_y.png)

## Icom IC-705

The transceiver does not support APRS directly. To work with APRS, therefore, you need
additional software to generate and decode the APRS signals. The IC-705 has to be connected
to a Windows computer over USB. Do not forget to install the USB drivers; you can download
them from the official [Icom](https://www.icomjapan.com/support/firmware_driver/3768/) site.
Install the drivers and restart the computer. After the restart you will see two new COM
ports in Device Manager.

![Device Manager](@site/docs/authors_materials/UT3USW/img/device-manager.jpg)

Along with the new COM ports you will also see a new sound device for passing audio between
the PC and the transceiver. It is important to set up your Icom correctly so the audio works
properly.

![Common > Connections](@site/docs/authors_materials/UT3USW/img/2023-07-0821.49.50.jpg)

Additional information and troubleshooting is described here: [h_r_d_trouble.pdf](https://assada.dead.guru/storage/images/h_r_d_trouble.pdf)

In theory, at this point your transceiver can transmit and receive audio straight from the
PC. That is, after "pressing" the PTT you could put YouTube on the air. But what do we need
that for? Let us set up APRS.

## Setting up APRS

The catch is that there is no APRS software (for Icom) that can send and receive APRS
packets over a COM port. That is why above we set up a sort of "USB COM VOX" mode. The APRS
client [PinPoint](https://www.pinpointaprs.com/) can work over the
[KISS TNC](https://en.wikipedia.org/wiki/KISS_(amateur_radio_protocol)) protocol across the
network. In general, a KISS TNC provides a simple way to move data between a computer and a
radio within packet radio, keeping complexity low and use simple.

The scheme we are going to set up looks like this:

![The scheme](@site/docs/authors_materials/UT3USW/img/download(1).png)

1. Download and install PinPoint APRS. [Download](https://assada.dead.guru/storage/images/pin_point_v2_build_230511.zip)
2. Download and install SoundModem. [Download](https://assada.dead.guru/storage/images/soundmodem114.zip) (This will be our KISS TNC server between the radio and PinPoint.)
3. Download the PTT library for SoundModem. [Download](https://assada.dead.guru/storage/images/ptt-dll.zip) and unpack this archive into the SoundModem folder.

![SoundModem should look roughly like this. The configuration files may be missing! They are created automatically the first time the program starts](@site/docs/authors_materials/UT3USW/img/2023-07-0822.09.32.jpg)

The CAT PTT library lets you set up the PTT (Push To Talk) function of SoundModem for the
Icom.

### Setting up SoundModem

Start SoundModem and open *Settings > Devices*. Here you must select the Icom input and
output devices! Tick the box next to *KISS Server Port*. In the *Select PTT port* field
choose **CAT**.

![Settings](@site/docs/authors_materials/UT3USW/img/image_2023-07-07_22-39-46.png)

Click *Advanced PTT settings*.

Here we set up a "virtual PTT" for our transceiver. From the screenshot, I think it is all
clear.

![Advanced PTT settings](@site/docs/authors_materials/UT3USW/img/image_2023-07-07_22-46-03.png)

> **Important!** In the Advanced PTT settings window, choose the COM port that Device Manager shows as "CI-V"!

That is basically it for SoundModem. You should see the waterfall and may already be able to
receive APRS packets right there in the SoundModem window.

### Setting up PinPoint APRS

Start PinPoint APRS and press F2 to open the settings window. Fill in your callsign and the
other APRS details.

![PinPoint APRS](@site/docs/authors_materials/UT3USW/img/image_2023-07-07_22-40-41.png)

Next we are interested in the *TNC* tab. Here we set up the connection to SoundModem. Choose
the *TNC Type* as network *KISS mode* and change the port to 8100 (or whatever you set in
SoundModem). You can ignore Serial TNC.

![TNC](@site/docs/authors_materials/UT3USW/img/image_2023-07-07_22-40-09.png)

Close the settings and click *Options -> Connect TNC*; in the status bar you should see
*Connected to TNC* or something similar.

That is all! Now you can send and receive APRS packets over the radio.

![photo_2023-07-0822.26.34.jpeg](@site/docs/authors_materials/UT3USW/img/photo_2023-07-0822.26.34.jpeg)


### P.S.
I had a certain problem where PinPoint connected to SoundModem successfully and received
packets over the radio, but for some reason could not transmit them. It sorted itself out
=) WireShark showed no network problems between PinPoint and SoundModem. If you have the same
problem, try restarting the computer.

It is also useful, for diagnosing TRANSMIT problems, to listen by ear to what the
transceiver is actually putting on the air. Because of a wrong audio-card configuration in
SoundModem, silence was being transmitted. Silence was also transmitted when the Icom
settings were wrong.

Source: [UT3USW's personal blog](https://ut3usw.dead.guru/docs/ham/icom-705-aprs)
