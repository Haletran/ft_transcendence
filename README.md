# 🏓 Ft_transcendence

Make a fullstack website to play Pong (Youpi...)

[Subject](https://cdn.intra.42.fr/pdf/pdf/133398/en.subject.pdf)

## COMMANDS

```bash
make game # to launch the game and access it
make backend # to launch the backend
make sujet # to open the subject
```

## STACK (JBDS)

> JBDS stack is popular right ??

<img width="300" height="300" src="https://media1.tenor.com/m/phyvUEXrZAUAAAAC/the-cat-in-the-hat-uh-no.gif"></img>

- FRONTEND : Vanilla JS [Documentation](https://www.w3schools.com/js/DEFAULT.asp)
- CSS library : Bootstrap toolkit [Documentation](https://getbootstrap.com/)
- BACKEND : Django (Python) [Documentation](https://docs.djangoproject.com/en/5.1/)
- DB : PostgreSQL [Documentation](https://www.postgresql.org/docs/current/) [Container](https://hub.docker.com/_/postgres/)

( Containerize Django and DB ) *multiple for django if microservices*

## 🗃️ OBLIGATIONS

- SPA (single-page-application)
- Compatible with ***Google Chrome***
- Everything must be launched with a single command line (Docker, like in *Inception*)
- Responsive ??

## 🕹️ GAME

The primary objective of this website is to facilitate Pong gameplay between users. Here are the key features:

- **Live Pong Gameplay**: Users should be able to engage in a live Pong game against another player directly on the website. Both players will use the same keyboard. The functionality can be enhanced with the Remote players module.

- **Tournament Mode**: Besides one-on-one games, users should also have the option to propose a tournament. This tournament will involve multiple players taking turns to play against each other. The implementation of the tournament is flexible, but it should clearly display the match-ups and the player order.

- **Registration System**: A registration system is necessary. At the start of a tournament, each player must input their alias. These aliases will be reset when a new tournament begins. The Standard User Management module can modify this requirement.

- **Matchmaking System**: The tournament system should organize the matchmaking of the participants and announce the upcoming match.

- **Uniform Game Rules**: All players must follow the same rules, including having identical paddle speed. This rule also applies to AI players; the AI must operate at the same speed as a human player.

- **Game Development**: The game must be developed in accordance with the default frontend constraints (as outlined above). Alternatively, the FrontEnd module can be used, or it can be overridden with the Graphics module. Regardless of the visual aesthetics, the game must retain the essence of the original Pong (1972).

## 🔐 SECURITY

1. **Password Hashing**: If your database stores passwords, ensure they are hashed.
2. **Protection Against Attacks**: Your website should be safeguarded against SQL injections and XSS.
3. **HTTPS Connection**: If your site features a backend or other elements, activating an HTTPS connection for all components is compulsory. Use wss instead of ws.
4. **Input Validation**: Implement a validation system for forms and user input. This can be done on the base page if there's no backend, or server-side if a backend is present.
5. **Website Security**: Prioritizing your website's security is crucial, whether or not you choose to implement the JWT Security module with 2FA. For example, if you decide to develop an API, make sure your routes are secure. Even if you choose not to use JWT tokens, the security of your site remains paramount.

## 🔍 Modules

To achieve 100% completion, you need to complete 7 major modules.

**Note** : Please note that two minor modules are equivalent to one major module.

### Bonus Points

- Each minor module completed will earn you an additional five points.
- Each major module completed will earn you an additional ten points.


### List of modules

- [ ] Major : Django backend / 1
- [ ] Major : Multiplayer / 2
- [ ] Major : AI Opponent / 3
- [ ] Major : Remote authentification / 4 (OAuth 2.0 authentication with 42)
- [ ] Major : Add Another Game with User History and Matchmaking. / 5
- [ ] Major : Implement WAF/ModSecurity with Hardened Configuration and HashiCorp Vault for Secrets Management. / 6
- [ ] Minor : Multiple language supports. / 6.5
- [ ] Minor : GDPR Compliance Options with User Anonymization, Local Data Management, and Account Deletion. / 7
- [ ] Major : Infrastructure Setup with ELK (Elasticsearch, Logstash, Kibana) for Log Management. / 8
- [ ] Minor : User and Game Stats Dashboards / 8.5
- [ ] Major : Live Chat / 9.5

**A voir :**
- [ ] Major : Store the score of a tournament in the Blockchain.
- [ ] Minor : Use a database for the backend -and more.


<hr>

## 🗂️ Database

> [!IMPORTANT]
> This might change during the project to add useful fields in the database. <br>
> And i don't know if linking multiple db together via a field make sense :(

<details>
<summary>DB model</summary>

```sql
CREATE SEQUENCE IF NOT EXISTS idk_id_seq;

CREATE TABLE IF NOT EXISTS idk (
  id bigint NOT NULL PRIMARY KEY DEFAULT nextval('idk_id_seq'),
  login char,
  email char,
  password char,
  profile_picture char,
  game_id bigint
);

CREATE TABLE IF NOT EXISTS "Other game" (
  game_id bigint NOT NULL PRIMARY KEY,
  victory_count bigint,
  lose_count bigint,
  played_count bigint
);

CREATE TABLE IF NOT EXISTS Pong (
  game_id bigint NOT NULL PRIMARY KEY,
  victory_count bigint,
  lose_count bigint,
  played_count bigint
);

CREATE TABLE IF NOT EXISTS users (
  id bigint NOT NULL PRIMARY KEY,
  login char
);

ALTER TABLE idk ADD CONSTRAINT idk_game_id_fk FOREIGN KEY (game_id) REFERENCES Pong (game_id);
ALTER TABLE idk ADD CONSTRAINT idk_game_id_fk_other FOREIGN KEY (game_id) REFERENCES "Other game" (game_id);
ALTER TABLE users ADD CONSTRAINT users_id_fk FOREIGN KEY (id) REFERENCES idk (id);
```

</details>

<details>
  <summary>Diagram</summary>

  <img src="https://cdn.discordapp.com/attachments/327077237184659457/1289189724866482287/DB_transcendence.png?ex=66f7eafe&is=66f6997e&hm=ff034f374398383059ac7a380b79071b09d177edfdda80d02fe427f62571f097&"></img>

</details>
