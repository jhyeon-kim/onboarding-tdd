##!make
#TAG                         := $$(git log -1 --pretty=format:%h)
#ECR_URI                     := 615496323698.dkr.ecr.us-east-1.amazonaws.com
#
#NAME_DB                     := onboarding-db
#NAME_SERVER                 := onboarding-web
#NAME_PROXY                  := onboarding-proxy
#
#ECR_ENDPOINT_DB          := ${ECR_URI}/${NAME_PROXY}
#ECR_ENDPOINT_SERVER         := ${ECR_URI}/${NAME_SERVER}
#ECR_ENDPOINT_PROXY          := ${ECR_URI}/${NAME_PROXY}
#
#LOCAL_IMG_COMMIT_SERVER     := ${NAME_SERVER}:${TAG}
#LOCAL_IMG_LATEST_SERVER     := ${NAME_SERVER}:latest
#LOCAL_IMG_COMMIT_PROXY      := ${NAME_PROXY}:${TAG}
#LOCAL_IMG_LATEST_PROXY      := ${NAME_PROXY}:latest
#LOCAL_IMG_COMMIT_DB      := ${NAME_DB}:latest
#LOCAL_IMG_LATEST_DB      := ${NAME_DB}:latest
#
#ECR_IMG_COMMIT_SERVER       := ${ECR_ENDPOINT_SERVER}:${TAG}
#ECR_IMG_LATEST_SERVER       := ${ECR_ENDPOINT_SERVER}:latest
#ECR_IMG_COMMIT_PROXY        := ${ECR_ENDPOINT_PROXY}:${TAG}
#ECR_IMG_LATEST_PROXY        := ${ECR_ENDPOINT_PROXY}:latest
#ECR_IMG_COMMIT_DB      := ${ECR_ENDPOINT_PROXY}:${TAG}
#ECR_IMG_LATEST_DB      := ${ECR_ENDPOINT_PROXY}:latest
#
##build:
##	@docker build -f _mongoDb.Dockerfile --build -t ${LOCAL_IMG_COMMIT_DB} .;
##	@docker build -f _server.Dockerfile --build -t ${LOCAL_IMG_COMMIT_SERVER} ../;
##	@docker build -f _proxy.Dockerfile --build -t ${LOCAL_IMG_COMMIT_PROXY} ../;
##	@docker tag ${LOCAL_IMG_COMMIT_SERVER} ${LOCAL_IMG_LATEST_DB};
##	@docker tag ${LOCAL_IMG_COMMIT_SERVER} ${LOCAL_IMG_LATEST_SERVER};
##	@docker tag ${LOCAL_IMG_COMMIT_PROXY} ${LOCAL_IMG_LATEST_PROXY};
##
##	@if [ $$env != "local" ]; then\
##        docker tag ${LOCAL_IMG_COMMIT_SERVER} ${ECR_IMG_COMMIT_SERVER};\
##        docker tag ${LOCAL_IMG_COMMIT_SERVER} ${ECR_IMG_LATEST_SERVER};\
##        docker tag ${LOCAL_IMG_COMMIT_PROXY} ${ECR_IMG_COMMIT_PROXY};\
##        docker tag ${LOCAL_IMG_COMMIT_PROXY} ${ECR_IMG_LATEST_PROXY};\
##        docker tag ${LOCAL_IMG_COMMIT_DB} ${ECR_IMG_COMMIT_DB};\
##        docker tag ${LOCAL_IMG_COMMIT_DB} ${ECR_IMG_LATEST_DB};\
#
#build:
#ifeq (${env}, test)
#	@echo if
#	@docker build -f _server.Dockerfile -t ${LOCAL_IMG_COMMIT_SERVER} ../
#	@docker build -f _proxy.Dockerfile -t ${LOCAL_IMG_COMMIT_PROXY} ./
#	@docker build -f _mongoDb.Dockerfile -t ${LOCAL_IMG_COMMIT_DB} ./
#else
#	@echo elseif
#	@docker buildx build --platform=linux/amd64 -f _server.Dockerfile -t ${LOCAL_IMG_COMMIT_SERVER} ../
#	@docker buildx build --platform=linux/amd64 -f _proxy.Dockerfile -t ${LOCAL_IMG_COMMIT_PROXY} ./
#	@docker buildx build --platform=linux/amd64 -f _mongoDb.Dockerfile -t ${LOCAL_IMG_COMMIT_DB} ./
#endif
#	@docker tag ${LOCAL_IMG_COMMIT_SERVER} ${LOCAL_IMG_COMMIT_SERVER}
#	@docker tag ${LOCAL_IMG_COMMIT_PROXY} ${LOCAL_IMG_COMMIT_PROXY}
#	@docker tag ${LOCAL_IMG_COMMIT_DB} ${LOCAL_IMG_COMMIT_DB}
#
#	@docker tag ${LOCAL_IMG_COMMIT_SERVER} ${ECR_IMG_COMMIT_SERVER}
#	@docker tag ${LOCAL_IMG_COMMIT_SERVER} ${ECR_IMG_LATEST_SERVER}
#	@docker tag ${LOCAL_IMG_COMMIT_PROXY} ${ECR_IMG_COMMIT_PROXY}
#	@docker tag ${LOCAL_IMG_COMMIT_PROXY} ${ECR_IMG_LATEST_PROXY}
#	@docker tag ${LOCAL_IMG_COMMIT_DB} ${ECR_IMG_COMMIT_DB}
#	@docker tag ${LOCAL_IMG_COMMIT_DB} ${ECR_IMG_LATEST_DB}
#
##
##run:
##	@echo $$env;
##	@sh run.sh $$env
#
#push:
#	@aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 615496323698.dkr.ecr.us-east-1.amazonaws.com/
#	@docker push ${ECR_IMG_COMMIT_SERVER}
#	@docker push ${ECR_IMG_LATEST_SERVER}
#	@docker push ${ECR_IMG_COMMIT_PROXY}
#	@docker push ${ECR_IMG_LATEST_PROXY}
#	@docker push ${ECR_IMG_COMMIT_DB}
#	@docker push ${ECR_IMG_LATEST_DB}
##
##network:
##	@sh create-network.sh
#
#kill:
#	@echo 'Killing container...'
#	@docker-compose -f docker-compose.yml -p
#
#delete:
#	# latest 태그 제외하고 모든 이미지, 또는 none 삭제
#	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep onboarding-web | awk '{print ($$2":"$$3)}')
#	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep onboarding-db | awk '{print ($$2":"$$3)}')
#	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep onboarding-proxy | awk '{print ($$2":"$$3)}')
#	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep none | awk '{print $$1}')
#
#build:
#	@docker build -f _server.Dockerfile -t test .
#	@docker tag test 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/test
#
#push:
#	@aws aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com
#	@docker tag test:latest 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/test:latest
#	@docker push 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/test:latest
#delete:
#	@docker rmi -f $$(docker images -f "dangling=true" -q)
#
build:
	@docker build -f _server.Dockerfile -t onboarding-web .
	@docker tag onboarding-web 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-web
	@docker build -f _mongoDb.Dockerfile -t onboarding-db .
	@docker tag onboarding-db 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-db
	@docker build -f _proxy.Dockerfile -t onboarding-proxy .
	@docker tag onboarding-proxy 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-proxy

push:
	@aws aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com8.dkr.ecr.ap-northeast-1.amazonaws.com
	@docker tag onboarding-web:latest 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-web:latest
	@docker push 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-web:latest
	@docker tag onboarding-db:latest 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-db:latest
	@docker push 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-db:latest
	@docker tag onboarding-proxy:latest 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-proxy:latest
	@docker push 615496323698.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding-proxy:latest
delete:
	@docker rmi -f $$(docker images -f "dangling=true" -q)