reset-js:
    docker compose down
    docker volume rm $(shell docker compose config --volumes | grep node_modules)
    docker compose up -d web
    ## Add web-2 here when it exists