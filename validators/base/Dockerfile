FROM alpine
WORKDIR /validator
RUN apk update
RUN apk add bash git nodejs npm python3 py3-pip
RUN pip install pycryptodomex
RUN npm i zx file-type glob