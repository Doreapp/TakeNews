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

build: 		## Build docker image
build:
	docker build -t $(DOCKER_IMAGE) $(OPTIONS) .

run_%: 		## Run 'npm run %'
run_%:
	$(DOCKER_RUN) -t $(DOCKER_IMAGE) run $(shell echo $@ | cut -d _ -f 2-)

start: 		## Run 'npm start': start the development server
start:
	$(DOCKER_RUN) -i -t $(DOCKER_IMAGE) start

dev: 		## Build and start the development server
dev: build start

format: 	## Build and reformat the code
format: build run_format

lint: 		## Build and check code format
lint: build run_lint

_interactive: # Enter the docker image interactivelly
_interactive: build
	$(DOCKER_RUN) -i --entrypoint /bin/bash -t $(DOCKER_IMAGE)

_node_modules: # Force node_nodules update
	mkdir -p node_modules
	$(DOCKER_RUN) \
		-v $(shell pwd)/node_modules:/app/node_modules \
		-t $(DOCKER_IMAGE) install

node_modules: 	## Build and return node_modules directory using docker
node_modules: build _node_modules