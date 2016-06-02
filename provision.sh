#!/usr/bin/env bash

# use noninteractive mode since this is automated
export DEBIAN_FRONTEND=noninteractive

# suppress erroneous error messages from dpkg-preconfigure
sudo -E rm -v /etc/apt/apt.conf.d/70debconf

# update the package database 
sudo -E apt-get update

# install git
sudo -E apt-get install -y git

# install Node.js v4.x
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo -E apt-get install -y nodejs

# install build-essential for Node modules w/native code
sudo -E apt-get install -y build-essential

# allow Node.js servers to bind to low ports
sudo -E apt-get install -y chase
sudo -E apt-get install -y libcap2-bin
sudo -E setcap cap_net_bind_service=+ep $(chase $(which node))


# install MariaDB 10.1
apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db
add-apt-repository 'deb [arch=amd64,i386] http://sfo1.mirrors.digitalocean.com/mariadb/repo/10.1/ubuntu trusty main'
apt-get update
apt-get install -y mariadb-server

# install MongoDB and tools
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
apt-get update
apt-get install -y mongodb-org

# install recent version of redis
add-apt-repository -y ppa:rwky/redis
apt-get update
apt-get install -y redis-server

# set the loglevel for npm to show errors only
npm config set loglevel error -g

# install the tsd utility for installing
# Visual Studio Code typings files
# gives statement completion and parameter hinting
npm install -g tsd
