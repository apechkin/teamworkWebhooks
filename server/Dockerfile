FROM registry.adv-ms.com/cis/node-oracle-driver

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src && cp -a /tmp/node_modules /usr/src/
WORKDIR /usr/src
COPY . /usr/src
RUN cd /usr/src
RUN npm link oracledb
