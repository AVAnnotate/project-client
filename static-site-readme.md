# AVAnnotate Static Site

A static site of your AVAnnotate project is contained within this directory. This site can be deployed to any web server (i.e. [Apache](https://httpd.apache.org/), [NginX](https://nginx.org/en/)). How this is done is beyond the scope of this document.

A static site can also be run locally on your machine. The simplest approach is to use the [Python web server](https://docs.python.org/3/library/http.server.html).

## Install Python

[On Windows](https://builtin.com/software-engineering-perspectives/how-to-install-python-on-windows)

[On Mac](https://docs.python-guide.org/starting/install3/osx/)

## Run http.server

1. Navigate to your local copy of the `/site` directory in the appropriate terminal for your OS.

2. Enter the following command at the terminal prompt:

```
python3 -m http.server 8000
```

3. Navigate your browser to `http://localhost:8000
