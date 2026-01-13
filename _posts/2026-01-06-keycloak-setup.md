---
title: Setting up custom Keycloak Authentication
description: Building custom Keycloak SPI with Java for SQL Authentication.
author: marshawn
date: 2026-01-09 00:02:31 +0800
categories: [Azure-Keycloak-Project]
tags: [network, system]
mermaid: true
---


# Keycloak
Keycloak is an open-source Identity and Access Management (IAM) tool for managing user authentication and authorization. In my case, I used Keycloak's OpenID Connect (OIDC) to allow me to use Keycloak functions alongside Azure APIs.

The whole purpose of my using Keycloak is to implement on-premise SQL services and to separate the Authentication and Authorization process. My first obstacle is that Keycloak doesn't provide an easy interface for connecting to a local SQL server, so I have to create my own. Luckily, Keycloak does allow for custom Service Provider Interfaces (SPIs) through Java code to extend/override default behaviors, which is exactly what we are looking for.

## Custom SPI
I programmed a Java project using documentation from Keycloak and examples of creating custom SPIs. The program is used in the authentication process and requires the user's email/user to find their data within my local database. Once their information is found and their email is confirmed to exist in the database, their password gets hashed and compared to another hash with the matching ID in the SQL server.

### SPI Authentication Flow
1. User submits credentials to Keycloak through HTTP request
2. Keycloak invokes the custom Authenticator SPI
3. SPI queries the local SQLite database using provided username and password
4. Password is hashed and compared
5. Authentication result is returned to Keycloak for JWT distribution

![Desktop View](..\screenshots\Screenshots\2026-01\VirtualBoxVM_SVrGR2ELcH.png)
<sub>* My VSCode was giving me intellisense problems, but my code was fine.
 [`GitHub Repo`](https://github.com/ItsJustKon/SQLAUTH)
<sub>

## JWT (Json Web Token)
In order to later authorize users based on their groups/roles, these values need to be included in the authenticated token that Keycloak provides after successful login.

I need to add "Token mappers" to my client/application to tell Keycloak to include the roles and groups of users within the JSON Web Token when the user is authenticated. Since the roles and groups are encoded into the JWT, Azure will be able to identify which users have which roles and delegate resources accordingly.

![Desktop View](..\screenshots\Screenshots\2026-01\VirtualBoxVM_lFmqd43rOe.png)

![Desktop View](..\screenshots\Screenshots\2026-01\chrome_6OxXHgFOWH.png)

## Direct Access Grant 
I opted to use the "Direct Access Grants" Authentication flow since it gives the most direct and simple token exchange process through API/HTTP request.

![Desktop View](..\screenshots\Screenshots\2026-01\VirtualBoxVM_WsVEhMyclm.png)

With this Authentication flow enabled, I can send a simple HTTP POST request with the users' usernames and passwords and get back an access token that acts as their ID.

## Problems I fixed

### SQLite Library
One problem I had with the building of the SQL SPI was that the SQLite library that allowed me to programatically interact with my local databases wasn't being registered when I placed the jar file into the providers folder, so that Keycloak would use it. Maybe I don't understand how Java libraries work or something, but I ended up fixing the issue by downloading the jar file for the SQLite library itself and adding that to the providers folder as well.

### Making Keycloak Services publicly accessible
So this wasn't an issue that popped up out of nowhere because I knew that I couldn't use a Keycloak service hosted on localhost with a cloud provider, so I tried to do port forwarding on my router. Unfortunately but fortunately, my internet provider doesn't allow public-facing port forwarding so I ended up remembering a service that allows me to create public tunnels to connect local services to the internet. With this in mind, I ended up using `ngrok` to allow external servers to interact with my local Keycloak server.

### Configurations
Overall, the hardest part about setting up Keycloak was configuring everything correctly and knowing what to configure in the first place. This required me to research thoroughly, look at examples, and understand why they work. Small configurations were needed almost everywhere, and when you didn't make the correct one, you wouldn't get an error message; things just wouldn't execute as expected. This means that when developing with Keycloak, you either need to know exactly what you're doing or know how to find out.

## Possible Vulnerabilities

### SQL Injection
SQL injection may be possible because within the backend, there are no checks for malicious inputs, and the users' usernames and passwords are directly included in the SQL query.
![Desktop View](..\screenshots\Screenshots\2026-01\VirtualBoxVM_6om3BweWwP.png)

Depending on the security within SQLite, command injection could be possible, but at the very least, modifying user data is possible. If an attacker is able to modify the data of users, they could use an account they have access to and add it to the role of admin or a role that they're not supposed to have, causing unauthenticated access to resources within other areas of the application.

<sub>* This works since roles are also set in the users database<sub>

## Lessons Learned
1. Error messages are really useful because, without them, problems are harder to solve.
2. Ngrok is a great solution for port forwarding on simple projects because it's simple to set up and doesn't expose your IP address to the internet.
3. Previous projects, examples, and documentations are your friends.

## Next Steps
Now I have to use Azure to host my static web app and to manage authorization to resources. Azure will use the JWT for identification.


  <!-- Thank you for your time.  -->





