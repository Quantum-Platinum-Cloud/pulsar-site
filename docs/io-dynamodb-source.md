---
id: io-dynamodb-source
title: AWS DynamoDB source connector
sidebar_label: "AWS DynamoDB source connector"
---

:::note

You can download all the Pulsar connectors on [download page](pathname:///download).

::::

The DynamoDB source connector pulls data from DynamoDB table streams and persists data into Pulsar.

This connector uses the [DynamoDB Streams Kinesis Adapter](https://github.com/awslabs/dynamodb-streams-kinesis-adapter),
which uses the [Kinesis Consumer Library](https://github.com/awslabs/amazon-kinesis-client) (KCL) to do the actual
consuming of messages. The KCL uses DynamoDB to track the state of consumers and requires cloudwatch access to log metrics.


## Configuration

The configuration of the DynamoDB source connector has the following properties.

### Property

| Name | Type|Required | Default | Description 
|------|----------|----------|---------|-------------|
`initialPositionInStream`|InitialPositionInStream|false|LATEST|The position where the connector starts from.<br /><br />Below are the available options:<br /><br /><li>`AT_TIMESTAMP`: start from the record at or after the specified timestamp.<br /><br /></li><li>`LATEST`: start after the most recent data record.<br /><br /></li><li>`TRIM_HORIZON`: start from the oldest available data record.</li>
`startAtTime`|Date|false|" " (empty string)|If set to `AT_TIMESTAMP`, it specifies the point in time to start consumption.
`applicationName`|String|false|Pulsar IO connector|The name of the KCL application.  Must be unique, as it is used to define the table name for the dynamo table used for state tracking. <br /><br />By default, the application name is included in the user agent string used to make AWS requests. This can assist with troubleshooting, for example, distinguish requests made by separate connector instances.
`checkpointInterval`|long|false|60000|The frequency of the KCL checkpoint in milliseconds.
`backoffTime`|long|false|3000|The amount of time to delay between requests when the connector encounters a throttling exception from AWS Kinesis in milliseconds.
`numRetries`|int|false|3|The number of re-attempts when the connector encounters an exception while trying to set a checkpoint.
`receiveQueueSize`|int|false|1000|The maximum number of AWS records that can be buffered inside the connector. <br /><br />Once the `receiveQueueSize` is reached, the connector does not consume any messages from Kinesis until some messages in the queue are successfully consumed.
`dynamoEndpoint`|String|false|" " (empty string)|The Dynamo end-point URL, which can be found at [here](https://docs.aws.amazon.com/general/latest/gr/rande.html).
`cloudwatchEndpoint`|String|false|" " (empty string)|The Cloudwatch end-point URL, which can be found at [here](https://docs.aws.amazon.com/general/latest/gr/rande.html).
`awsEndpoint`|String|false|" " (empty string)|The DynamoDB Streams end-point URL, which can be found at [here](https://docs.aws.amazon.com/general/latest/gr/rande.html).
`awsRegion`|String|false|" " (empty string)|The AWS region. <br /><br />**Example**<br /> us-west-1, us-west-2
`awsDynamodbStreamArn`|String|true|" " (empty string)|The DynamoDB stream arn.
`awsCredentialPluginName`|String|false|" " (empty string)|The fully-qualified class name of implementation of {@inject: github:AwsCredentialProviderPlugin:/pulsar-io/aws/src/main/java/org/apache/pulsar/io/aws/AwsCredentialProviderPlugin.java}.<br /><br />`awsCredentialProviderPlugin` has the following built-in plugs:<br /><br /><li>`org.apache.pulsar.io.kinesis.AwsDefaultProviderChainPlugin`:<br /> this plugin uses the default AWS provider chain.<br />For more information, see [using the default credential provider chain](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default).<br /><br /></li><li>`org.apache.pulsar.io.kinesis.STSAssumeRoleProviderPlugin`: <br />this plugin takes a configuration via the `awsCredentialPluginParam` that describes a role to assume when running the KCL.<br />**JSON configuration example**<br />`{"roleArn": "arn...", "roleSessionName": "name"}` <br /><br />`awsCredentialPluginName` is a factory class which creates an AWSCredentialsProvider that is used by Kinesis sink. <br /><br />If `awsCredentialPluginName` set to empty, the Kinesis sink creates a default AWSCredentialsProvider which accepts json-map of credentials in `awsCredentialPluginParam`.</li>
`awsCredentialPluginParam`|String |false|" " (empty string)|The JSON parameter to initialize `awsCredentialsProviderPlugin`.

### Example

Before using the DynamoDB source connector, you need to create a configuration file through one of the following methods.

* JSON 

  ```json
  {
     "configs": {
        "awsEndpoint": "https://some.endpoint.aws",
        "awsRegion": "us-east-1",
        "awsDynamodbStreamArn": "arn:aws:dynamodb:us-west-2:111122223333:table/TestTable/stream/2015-05-11T21:21:33.291",
        "awsCredentialPluginParam": "{\"accessKey\":\"myKey\",\"secretKey\":\"my-Secret\"}",
        "applicationName": "My test application",
        "checkpointInterval": "30000",
        "backoffTime": "4000",
        "numRetries": "3",
        "receiveQueueSize": 2000,
        "initialPositionInStream": "TRIM_HORIZON",
        "startAtTime": "2019-03-05T19:28:58.000Z"
     }
  }
  ```

* YAML

  ```yaml
  configs:
      awsEndpoint: "https://some.endpoint.aws"
      awsRegion: "us-east-1"
      awsDynamodbStreamArn: "arn:aws:dynamodb:us-west-2:111122223333:table/TestTable/stream/2015-05-11T21:21:33.291"
      awsCredentialPluginParam: "{\"accessKey\":\"myKey\",\"secretKey\":\"my-Secret\"}"
      applicationName: "My test application"
      checkpointInterval: 30000
      backoffTime: 4000
      numRetries: 3
      receiveQueueSize: 2000
      initialPositionInStream: "TRIM_HORIZON"
      startAtTime: "2019-03-05T19:28:58.000Z"
  ```

