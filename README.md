# Deploying a Web Application on AWS EC2

A hands-on project demonstrating manual deployment of a Node.js web application
on an AWS EC2 instance covering server provisioning, SSH access, dependency 
installation, reverse proxy configuration, and process management.

## Project Overview

This project deploys a Node.js + Express file upload web application on a live 
AWS EC2 Ubuntu server, making it accessible to anyone on the internet via a 
public IP address without using any automation tools or managed services.

## Live Demo

Access the deployed application at:

"http://52.66.239.129"

## Tech Stack

| Tool | Purpose |
|---|---|
| AWS EC2 (t2.micro) | Cloud server — Ubuntu 22.04 LTS |
| Node.js + Express | Application runtime |
| NGINX | Reverse proxy (port 80 → 3000) |
| PM2 | Process manager — keeps app alive |
| Git | Cloning application code |
| SSH | Secure remote server access |


## Deployment Steps

### Step 1  Launch EC2 Instance
- Launched a t2.micro Ubuntu 22.04 LTS instance on AWS (free tier)
- Created a key pair (.pem file) for SSH access
- Configured Security Group inbound rules:
  - Port 22 (SSH) — for remote access
  - Port 80 (HTTP) — for web traffic
  - Port 3000 (Node.js) — for direct app access

### Step 2 Connect via SSH

chmod 400 mykey.pem
ssh -i mykey.pem ubuntu@52.66.239.129

### Step 3 Update Server and Install Dependencies

sudo apt update -y && sudo apt upgrade -y
sudo apt install git -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx


### Step 4 Clone and Run the Application
git clone https://github.com/DevOpsInstituteMumbai-wq/AWS-EC2-instance.git
cd AWS-EC2-instance
npm install


### Step 5 Configure NGINX as Reverse Proxy

sudo nano /etc/nginx/sites-available/default

Configuration used:
"nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
"
"bash
sudo nginx -t
sudo systemctl restart nginx


### Step 6 Manage Process with PM2
sudo npm install -g pm2
pm2 start index.js --name "my-web-app"
pm2 save
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

### Step 7 Verify Deployment

pm2 status           # check app is online
sudo systemctl status nginx   # check nginx is active
curl http://localhost:3000    # test app locally

## Challenges Faced

- Play With Docker was deprecated adapted to use Docker Desktop on Windows
- SSH connection timeout due to incorrect Security Group rules fixed by 
  opening port 22 to all IPs
- PM2 errored due to missing node_modules fixed by running npm install 
  inside the correct project directory


## Author

Swaroop Suryawanshi 
Aspiring DevOps Engineer 


*This project demonstrates foundational DevOps skills cloud provisioning,
Linux administration, network security, and manual application deployment
on AWS infrastructure.*