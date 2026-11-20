{
  description = "dev shell";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [ nodejs_22 prettier git ];

          shellHook = ''
            if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
              echo "Installing npm dependencies..."
              npm ci || npm install
            fi
            export PATH="$PWD/node_modules/.bin:$PATH"
          '';
        };
      });
}
