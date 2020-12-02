# locode-server
Self-sufficient Node.JS webservice for locode database api

# config:
Use env.
    - LSRV_PORT (defaults to 8081)

# run:
`npm start`

# use:
to list all known locodes `http://localhost:8081/list`
to find, try for example `http://localhost:8081/find/aealb`

# good to know
    - Might be a bit slow at first. 
    - Data itself has geolocations, but Tingo doesn't support 2dsphere indexing.
    - Data is from UNECE website (https://www.unece.org/cefact/locode/welcome.html), I have only compiled it to this usable format
    - Functionmask is a 8bit mask corresponding UNLOCODE function data (see manual: https://www.unece.org/fileadmin/DAM/cefact/locode/UNLOCODE_Manual.pdf, section 3.6), rightmost bit is 1, leftmost is B, all bits off is unknown 