# L'identification avec la Blockchain

Pour la signature de l’engagement, une fois qu’un chercheur le signe, le smart contract associé sera validé et la confirmation de signature sera inscrite dans la Blockchain ce qui permettra au chercheur d’utiliser l’ensemble des jeux de données. Se pose la question de l’authentification. Comment s’assurer que seuls des chercheurs puissent être les seuls à s’identifier sur la plateforme ?&#x20;

Pour se faire nous avons décidé de passer par un système de certificat. Chaque laboratoire aura un Certificate Authority (CA), c’est ce qui permettra de donner un certificat aux chercheurs d’un laboratoire. On dira que le laboratoire est un Membership Service Provider (MSP). Établissons 2 cas distincts pour bien comprendre cette architecture:

![CA & MSP](../../.gitbook/assets/CA\_MSP.jpg)
