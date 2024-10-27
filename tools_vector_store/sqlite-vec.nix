{ lib
, python3Packages
, fetchPypi
}:

with python3Packages;
buildPythonPackage rec {
  pname = "sqlite_vec";
  version = "0.1.3";

  src = fetchPypi {
    inherit pname version;
    hash = "";
  };

  # Instead of fetchPypi, we can fetch the wheel directly if it's the only available distribution
  #src = fetchurl {
    #url = "https://files.pythonhosted.org/packages/.../sqlite_vec-0.1.3-py3-none-any.whl"; # Add correct wheel URL
    #sha256 = "sha256-of-the-wheel"; # Make sure to add the correct sha256
  #};

  # do not run tests
  doCheck = false;

  # specific to buildPythonPackage, see its reference
  pyproject = true;
  build-system = [
    setuptools
    wheel
  ];
}
