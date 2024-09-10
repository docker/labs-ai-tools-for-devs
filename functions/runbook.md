# sync yaml and edn registries

It's easier to read the yaml definition so use this script to convert the yaml to edn.

```sh
#docker:command=jet
jet -i yaml -o edn -k < registry.yaml > registry.edn
```
