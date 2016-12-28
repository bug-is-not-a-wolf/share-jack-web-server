# Run

## Ubuntu
```bash
-- Install Node.js
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g node-gyp

-- Install MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org

-- Run MongoDB
sudo service mongod start

-- Set up AES user
sudo useradd aes
sudo passwd aes

-- Install AES encryption server
git clone https://github.com/bug-is-not-a-wolf/share-jack-crypto-pipe.git
cd share-jack-crypto-pipe
npm install


-- Set up AES password
sudo runuser -l aes -c 'echo "password" > ./keys/cryptoStream.key'
sudo runuser -l aes -c 'chmod 500 cryptoStream.key'

-- Run AES server
sudo runuser -l aes -c 'npm start &'

cd ..

-- Install Node server
git clone https://github.com/bug-is-not-a-wolf/share-jack-web-server.git
cd share-jack-web-server
npm install

-- Set up private keys
echo "private-key" > ./keys/private.key

-- Configure IP tables
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 9080
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 9443

-- Run Node server
npm start &
```