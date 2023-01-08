PROJECT_NAME=takenews

# Port on which development server serves the app
PORT=3000

# Docker things
DOCKER_IMAGE=$(PROJECT_NAME)
DOCKER_RUN=docker run \
 -u $(shell id -u):$(shell id -g) \
 -v $(shell pwd)/src/:/app/src/ \
 -v $(shell pwd)/public/:/app/public/ \
 -p $(PORT):$(PORT)

all: dev

help: 		## Display help message
help:
	@echo Make targets:
	@echo
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

docker_build: 		## Build docker image
docker_build:
	docker build -t $(DOCKER_IMAGE) $(OPTIONS) .

run_%: 		## Run 'npm run %'
run_%:
	$(DOCKER_RUN) -t $(DOCKER_IMAGE) run $(shell echo $@ | cut -d _ -f 2-)

start: 		## Run 'npm start': start the development server
start:
	$(DOCKER_RUN) -i -e HTTPS=true -t $(DOCKER_IMAGE) start

dev: 		## Build and start the development server
dev: docker_build start

format: 	## Build and reformat the code
format: docker_build run_format

lint: 		## Build and check code format
lint: docker_build run_lint

build: 		## Build docker image and generate production-ready code in build directory
build: docker_build
	mkdir -p $(shell pwd)/build/
	$(DOCKER_RUN) \
		-e PUBLIC_URL \
		-v $(shell pwd)/build:/app/build \
		-t $(DOCKER_IMAGE) run build
	

_interactive: # Enter the docker image interactivelly
_interactive: docker_build
	$(DOCKER_RUN) -i --entrypoint /bin/bash -t $(DOCKER_IMAGE)

_node_modules: # Force node_nodules update
	mkdir -p node_modules
	$(DOCKER_RUN) \
		-v $(shell pwd)/node_modules:/app/node_modules \
		-t $(DOCKER_IMAGE) install

node_modules: 	## Build and return node_modules directory using docker
node_modules: docker_build _node_modules
