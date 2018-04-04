FROM vmelnychuk/nodejs-percona-tools

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm install

COPY . /code
