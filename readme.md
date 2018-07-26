# Cobbler

## Configuration

### From a development environment

Set the AWS credentials in `~/.aws/credentials` file:

```
[default]
aws_access_key_id = <AWS_ACCESS_KEY_ID>
aws_secret_access_key = <AWS_SECRET_ACCESS_KEY>
```

Specified key must have a permission to read secrets from the AWS Secrets Manager.

It is not possible to resolve references via the EC2 Loopback interface if not running from inside an EC2 instance.

### From inside an EC2 instance

Permissions must be configured by assigning roles with the appropriate policies to an EC2 instance.

## Environment variables

### AWS Secrets Manager

Set environment variables to ARN urls of their actual values prepended with the cobbler protocol:

```
process.env.EVERYTHING = 'cobbler://arn:aws:secretsmanager:eu-west-1:123456789123:secret:TheAnswerToUniverseAndEverything-0Z6hib'
```

If secret stored contains JSON value, you can use the pipe character to extract the necessary JSON property.


```
process.env.POSTGRES_HOST = 'cobbler://arn:aws:secretsmanager:eu-west-1:123456789123:secret:PostgresRDS-E8dwh4|host'
process.env.POSTGRES_PORT = 'cobbler://arn:aws:secretsmanager:eu-west-1:123456789123:secret:PostgresRDS-E8dwh4|port'
```

### EC2 Loopback Interface

```
process.env.HOSTNAME = 'cobbler://ec2:loopback:/latest/meta-data/hostname'
```

## Running application

Run application from the package root with:

```
npx cobbler
```

Environment variable references will be resolved and the `npm start` script executed from the same directory.
