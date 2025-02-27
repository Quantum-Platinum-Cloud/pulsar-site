---
id: io-kafka-sink
title: Kafka sink connector
sidebar_label: "Kafka sink connector"
---

:::note

You can download all the Pulsar connectors on [download page](pathname:///download).

::::

The Kafka sink connector pulls messages from Pulsar topics and persists the messages to Kafka topics.

This guide explains how to configure and use the Kafka sink connector.

## Configuration

The configuration of the Kafka sink connector has the following parameters.

### Property

| Name | Type| Required | Default | Description 
|------|----------|---------|-------------|-------------|
|  `bootstrapServers` |String| true | " " (empty string) | A comma-separated list of host and port pairs for establishing the initial connection to the Kafka cluster. |
|  `securityProtocol` |String| false | " " (empty string) | The protocol used to communicate with Kafka brokers. |
|  `saslMechanism` |String| false | " " (empty string) | The SASL mechanism used for Kafka client connections. |
|  `saslJaasConfig` |String| false | " " (empty string) | The JAAS login context parameters for SASL connections in the format used by JAAS configuration files. |
|  `sslEnabledProtocols` |String| false | " " (empty string) | The list of protocols enabled for SSL connections. |
|  `sslEndpointIdentificationAlgorithm` |String| false | " " (empty string) | The endpoint identification algorithm to validate server hostnames using a server certificate. |
|  `sslTruststoreLocation` |String| false | " " (empty string) | The location of the trust store file. |
|  `sslTruststorePassword` |String| false | " " (empty string) | The password of the trust store file. |
|`acks`|String|true|" " (empty string) |The number of acknowledgments that the producer requires the leader to receive before a request completes. <br />This controls the durability of the sent records.
|`batchsize`|long|false|16384L|The batch size that a Kafka producer attempts to batch records together before sending them to brokers.
|`maxRequestSize`|long|false|1048576L|The maximum size of a Kafka request in bytes.
|`topic`|String|true|" " (empty string) |The Kafka topic which receives messages from Pulsar.
| `keyDeserializationClass` | String|false | org.apache.kafka.common.serialization.StringSerializer | The serializer class for Kafka producers to serialize keys.
| `valueDeserializationClass` | String|false | org.apache.kafka.common.serialization.ByteArraySerializer | The serializer class for Kafka producers to serialize values.<br /><br />The serializer is set by a specific implementation of [`KafkaAbstractSink`](https://github.com/apache/pulsar/blob/master/pulsar-io/kafka/src/main/java/org/apache/pulsar/io/kafka/KafkaAbstractSink.java).
|`producerConfigProperties`|Map|false|" " (empty string)|The producer configuration properties to be passed to producers. <br /><br />**Note: other properties specified in the connector configuration file take precedence over this configuration**.


### Example

Before using the Kafka sink connector, you need to create a configuration file through one of the following methods.

* JSON 

  ```json
  {
     "configs": {
        "bootstrapServers": "localhost:6667",
        "topic": "test",
        "acks": "1",
        "batchSize": "16384",
        "maxRequestSize": "1048576",
        "producerConfigProperties": {
           "client.id": "test-pulsar-producer",
           "security.protocol": "SASL_PLAINTEXT",
           "sasl.mechanism": "GSSAPI",
           "sasl.kerberos.service.name": "kafka",
           "acks": "all" 
        }
     }
  }
  ```
  
* YAML
  
  ```yaml
  configs:
      bootstrapServers: "localhost:6667"
      topic: "test"
      acks: "1"
      batchSize: "16384"
      maxRequestSize: "1048576"
      producerConfigProperties:
          client.id: "test-pulsar-producer"
          security.protocol: "SASL_PLAINTEXT"
          sasl.mechanism: "GSSAPI"
          sasl.kerberos.service.name: "kafka"
          acks: "all"   
  ```
