Let Girls Learn
===============

As part of the U.S. government's commitment to [Let Girls Learn](https://letgirlslearn.peacecorps.gov "Let Girls Learn"), First Lady Michelle Obama and the Peace Corps have formed a powerful collaboration to expand access to education for adolescent girls around the world. Educating girls is essential to healthy and thriving communities but, globally, 62 million girls are not in school, and barriers to adolescent girls completing school are particularly significant. In some countries, fewer than 10% of teenage girls complete secondary school.

Let Girls Learn is a new microsite dedicated to the initiative.

## Setup

`gem install jekyll`
`npm install`

# Building the Site
`grunt build`

### Deployments
You'll need to install `s3cmd` on your computer. For example:

`brew install s3cmd`


You can then create a `.config` file in the top directory of the project.

The *first line* of this file should contain the *staging* bucket URL. The *second line* of this file should contain the *production* bucket URL. For example:

```
s3://staging-bucket
s3://production-bucket
```

#### Running Make

It's very simple to deploy. Run `make staging` to deploy to the staging bucket and `make production` to deploy to production.