{
  description = "Dev environment with paperback-cli, nodejs";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };

      paperback-cli = pkgs.buildNpmPackage {
        pname = "paperback-cli";
        version = "1.4.0";

        src = pkgs.fetchFromGitHub {
          owner = "Paperback-IOS";
          repo = "paperback-cli";
          rev = "v1.4.0";
          hash = "sha256-uYxtDg1nvn3KVeCCt5Upe1qFsS17096nMnBr71bd/8c=";
        };

        npmDepsHash = "sha256-2u83ee+yNIyD1dOZd7Nl0LKH9VpTNaYTg8LohbfoBAg=";
        npmBuildScript = "prepack";
        npmPackFlags = [ "--ignore-scripts" ];
      };

    in {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          paperback-cli
          pkgs.nodejs_22
        ];

        shellInit = ''
          npm install
        '';
      };
    }
  );
}
