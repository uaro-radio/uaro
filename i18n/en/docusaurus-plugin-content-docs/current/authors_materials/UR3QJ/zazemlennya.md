---
sidebar_position: 1
---

# A quick earthing trick that avoids cutting into the cable

Take an ordinary hose clamp and fit it to the body of the feeder connector, then run a
busbar from there to the rebar or to a separate earthing loop. You do have to understand,
though, that protection of the antenna and feeder system and of the equipment must be
comprehensive, and must start at the antenna end rather than only at the transceiver.

**The first thing to watch**

People often try to press into service the surge arresters or varistors intended for UTP
(Ethernet) cable, which is wrong. The first thing to establish is how much power will be
applied and what antenna is in use. The arrester must be chosen with a striking voltage
about 1.5 times higher than the peak voltage in the feeder at an SWR of a little over
1.5–2. Typical arrester currents are 100–200 kA. For smaller currents the closest match is
an arrester made from spark plugs without a built-in resistor. The gap should then be set
for a little more than the applied power (for dry air under normal conditions the
breakdown strength is of the order of 30 kV/cm). And then, if the earthing arrester is
fitted on the antenna side, a choke balun with an additional arrester after it becomes
essential. The reason is that when it fires, the arrester on the antenna side equalises the
potentials on the centre conductor and the braid, leaving a difference equal to the
striking and sustaining voltage of the discharge. As a result the induced lightning pulse
becomes common-mode as far as the choke is concerned, and the choke attenuates it
effectively — though not completely.

**The second thing to watch**

A choke balun wound from the feeder is often credited solely with the role of a balancing
device that suppresses unbalanced currents and common-mode interference when a balanced
antenna is fed with an unbalanced feeder. But it is also an effective part of comprehensive
protection against induced lightning pulses, because for the fast current pulses
characteristic of discharges the choke (a few turns of cable) presents a high reactance.

**_Taken together, the following protective measures should be observed:_**

1. Earthing of the mast
2. A short-circuited antenna
3. A choke balun of at least 50 µH for high reactance to discharge pulses, and arresters both at the antenna and after the choke
4. Use of feeder cable with a braid cross-section of at least 10 mm²
5. Earthing at the equipment end
7. Disconnection of the antenna and feeder system, kept well clear of metal heating pipes

Further reading

1. [An introduction by Viktor Pashchenko, "Lightning protection. Back to basics"](https://drive.google.com/open?id=1OoZ751gytxt7m8Bfk6IY5w4irTsGm4Jl)
2. [Principles of comprehensive lightning protection for radio equipment](https://drive.google.com/open?id=1pzikxAg4TH4etx8MOpjCPm-MvFaNJFBU)
3. [Installation of lightning protection for buildings and structures](http://www.portali.ho.ua/doc/dstu-b-v.2.5-38.2008-ua.pdf)
4. [Lightning protection for a house](https://zandz.com/ru/molniyezashchita_doma.html)
5. Bazelyan. [The physics of lightning and lightning protection](https://drive.google.com/file/d/13jOwe-FpvcTf6hNDfiviYEeVb2qPIK3-/view)

![Earthing](@site/docs/img/img1.png)
![Earthing](@site/docs/img/img2.png)
