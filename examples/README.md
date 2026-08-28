# Sample snapshots

`before-android-14.json` and `after-android-15.json` model a wireless local
media setup before and after an Android upgrade. They contain invented device
facts and no account, serial, Wi-Fi, or MAC data.

Run `compat-scout demo` to write a comparison and prerequisite report without
connecting a device.

`benchmark/` contains 15 redacted, named setup fixtures. Ten are before/after
snapshot pairs for `compat-scout compare`; five pair a snapshot with declared
requirements for `compat-scout check`. The public-CLI regression test reads
their paths from `compatibility-benchmark.json` and requires at least 12
expected categories.
