staging_url := $(shell sed -n '1p' .config)
production_url := $(shell sed -n '2p' .config)
now := $(shell date -u +"%y-%m-%dT%H%M%SZ")

all:
	$(if $(shell if which s3cmd; then echo ok; fi), , $(error please install s3cmd))

staging:
	s3cmd put  --no-mime-magic --acl-public --exclude-from .s3ignore -r rendered/ $(staging_url)

production:
	s3cmd put  --no-mime-magic --acl-public --add-header="Cache-Control:max-age=600" --exclude-from .s3ignore -r rendered/ $(production_url)
