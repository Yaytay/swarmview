# SwarmView

SwarmView is the best (if your requirements are the same as mine) UI for seeing what is going on in your Docker Swarms.

SwarmView is a relatively thin layer over the Docker API, with a few clever tricks to present more useful information.

A few things that SwarmView will never do:

- There is no authentication or other security provided by SwarmView.
  SwarmView is designed to be run behind some other authentication mechanism - typically this would be something like oauth-proxy or a reverse proxy that supports OAuth.
- SwarmView does not permit you to change anything.
  I expect you to handle all of your deployment aspects via GitOps, so there is no need for SwarmView to provide that functionality.
  This also means that I do not currently consider authorisation (though that isn't guaranteed for the future, it may become possible to restrict access if people think that would be useful).
- SwarmView does not require any priviliged access.
  I am horrified by the level of access required by some Swarm management tools, SwarmView just requires access to the Docker API.
  Furthermore, all access to the Docker API is through (wollomatic/socket-proxy)[https://github.com/wollomatic/socket-proxy] which ensures that only GET requests can be issued.





