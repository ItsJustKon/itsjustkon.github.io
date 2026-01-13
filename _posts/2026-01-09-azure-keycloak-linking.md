---
title: Linking Azure to use Keycloak for Authentication
description: Azure and Keycloak work together for Authentication and Authorization flow.
author: marshawn
date: 2026-01-09 00:06:31 +0800
categories: [Azure-Keycloak-Project]
tags: [network, azure]
mermaid: true
---


# Azure Static Web App & API Manager
I plan on using Azure to not only host my site but also deal with authorizing users to resources. I've already created the actual site in HTML and JavaScript, and now I just need to upload it to Azure for hosting.

## Azure Static Web App
### Set-up
I chose to connect Azure to my GitHub and have all the site files on GitHub so that Azure can access them. This makes updating easy and quick, which I end up doing quite a bit.

![Desktop View](..\screenshots\Screenshots\2026-01\chrome_8lDSthQYiF.png)

With GitHub connected, all I have to do is push my changes to the repo that holds my site, and everything will update on Azure's side. I've made a bunch of commits updating the website to work with Azure and Keycloak, so check out the [`GitHub Repo`](https://github.com/ItsJustKon/EmployeeDashboard) if you're interested in exactly how it operates.

### JavaScript Responsbilities
1. Handle request to Keycloak ngrok URL
2. Manage sending valid usernames and passwords
3. Handle all errors and overall performance of the site
4. Send authenticated api requests using the Authorization header
5. Parse api response into HTML and reload and update the current HTML


## Application Programming Interface Management (APIM)
The APIM is what makes everything possible and ties it all together. The APIM is responsible for applying rules and policies to all requests that go through it.

In this picture, you can see some of the rules I set for the manager.

![Desktop View](..\screenshots\Screenshots\2026-01\chrome_X3r4UTzcCt.png)

Of course, I still had to do a decent amount of configuration in order to link Keycloak and assign Keycloak as an authenticated token issuer. I set the ngrok URL as the issue of tokens, and Azure would have to get information from ngrok to validate the tokens. Also, as you can see in the image, I set up some logic to allow users with certain roles to access resources that require those roles.  **(There is a Broken Access Control Vulnerbility)**

## Problems I fixed

### Policy Enforcement
Whenever I would try to access the website or certain pages, I would have errors, either saying I wasn't authenticated or that my group didn't exist, even though it did. What fixed my problem was realizing that I could code my own logic into the policy that APIM uses. With having an XML interface to execute my logic, I didn't need resources like the "Azure Functions" system, which was way more expensive.

### Inaccessible resources for APIM
I had a small problem that the APIM that lies on top of my original static webapp would say that a path that I know exists wasn't there. The problem turned out to be my routes configuration on the original SWA; it denied all access to certain paths, even blocking the APIM. The fix was to disable the blocking on the SWA and whitelist the APIM so that it could access everything and operate as the original site.

## Possible Vulnerabilities

### Broken Access Control (BAC)
Since my logic for the APIM policy doesn't specify which role is allowed to access which page, as long as a user has any role, they are allowed access. This is called Broken Access Control (BAC). Any user from any group can access any resource, even if it isn't intended for their group, as long as they are a part of **a** group. 

## Simplified Flow
![Desktop View](..\screenshots\Screenshots\2026-01\chrome_E9Bku1aGhm.png)

## Lessons Learned
1. Azure, being a cloud provider, doesn't really leave much room for unconfigured settings to lead to security concerns, which makes some people's jobs easier.
2. The Azure APIM made everything possible by allowing users to use XML to program logic to create custom policies.
3. Be more careful when adding resources to the cloud because they will charge you money you may not have.

![Desktop View](..\screenshots\Screenshots\2026-01\chrome_NVfJldtZoH.png)
<sub>* Since I'm unemployed, I will have to stop the APIM service and use a different target to demonstrate my abilities.</sub>

## Conclusion
This was a pretty difficult project to perform, especially since code development isn't my thing, and this was completely uncharted territory for me. The plan was to use this setup to simulate real-world attacks on webpages from both blue and red team angles. However, since the APIM costs money that I don't have, I will likely switch to a different target. This was fun, but maybe my next post will be on something more security-related.

Thank you for your time.


  <!-- Thank you for your time.  -->





