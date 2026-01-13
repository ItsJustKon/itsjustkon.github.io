---
title: Starting an Azure Static Web App
description: Combining on-premise SQL database with Cloud authorization to create public facing static site.
author: marshawn
date: 2025-12-15 00:07:00 +0800
categories: [Azure-Keycloak-Project]
tags: [network, azure]
mermaid: true
---


# Azure
Azure is a cloud computing platform that allows for scalabilty and flexibility of complex services. Today I will be creating a sample site for our sample users:

* John
* Sussie
* Blake

## Components
1. Static WebApp Service
2. Active Directory

## Plan
The plan is to create a static webapp with low cost in Azure. We want to use the Azure Active Directory (AD) service for authentacation which will be worked with later.

## First things first
Before I'm able to set up a static web app on Azure, I first need to program a static web app. The structure of the web app will be a login screen that sends you to a universal home page that can lead to different dashboards. For this example, I will stop after I reach the universal dashboard.

![Desktop View](..\screenshots\Screenshots\2025-12\chrome_T1AouXGTT9.png)
<sub>* I know its beautiful, right?</sub>

While creating the website and attempting to use both a SQL server and Azure AD, I found out that I am most likely going to need to use the Hybrid connection services on Azure to connect my on-premise machine with the Azure cloud provider.

![Desktop View](..\screenshots\Screenshots\2025-12\chrome_XsKtwcScLc.png)

When trying to connect my machine to Azure, I kept running into a 401 Error, which usually means unauthorized. I had already entered my credentials, so I was confused for a moment about what the problem was. Later, I found out that there are some services not registered that need to be enabled to have a hybrid environment in Azure. Once I enabled those services, everything seemed to be connected.

![Desktop View](..\screenshots\Screenshots\2025-12\VirtualBoxVM_I92zlk3Qo3.png)
<sub>* Connected server using </sub>
```bash
sudo azcmagent connect --subscription-id "{sub-id}" --resource-group "HybridServers" --location "eastus" --tenant-id "{ten-id}"
```

Now that I have the Ubuntu machine connected to Azure I need to configure Azure to use the machine for authentication.

![Desktop View](..\screenshots\Screenshots\2025-12\VirtualBoxVM_AvJqFNH9Kz.png)
I created some sample user data along with some password hashes using the id number as the salt and populated the honeypot with nonsense data. In this example, I used the MD5sum hashing algorithm even though it is out of date and vulnerable. Usually, I would opt for something more secure like Argon2 or bcrypt, but for testing purposes, we will use MD5.

Overall we now have 3 SQL databases:
1. Users
2. "Cache"
3. "PassHashes"

All of which have 3 records of data associated with the users: 
* John
* Sussie
* Blake

This is the perfect starting place for our target/main system we will be working with. 

So now is when the real pain starts. I researched deeper into how to make my authentication and authorization flow work and found out that it would take a lot of customization and configuration of different components. Before I stated that I may need a HybridConnection within Azure, however, I was wrong, and here is the list of the real assets that I'll need to make everything possible:

* Keycloak
* Azure Static Web App
* Azure API Manager

Having to use only 3 components may sound like it would be too hard, but the configurations for each will be thorough and complex. So much so that I will be splitting the documentation into 2 sections, one on Keycloak and the other on Azure. I hope you all will check out my 2 other posts, and thank you for your time!


  <!-- Thank you for your time.  -->





