{ lib
, python3Packages
, fetchPypi
 }:

with python3Packages;
buildPythonPackage rec {
  pname = "clipboard";
  version = "0.0.4";
  pyproject = true;

  src = fetchPypi {
    inherit pname version;
    hash = "sha256-pyp46cm/aNocPynuAiQX0T7J44JLURVZ/StwKx3VuBc=";
  };

  buildInputs = [
    setuptools
    pyperclip
  ];

  propogatedBuildInputs = [pyperclip];

  dependencies = [
    setuptools
  ];

  build-system = [
    setuptools
  ];
}
