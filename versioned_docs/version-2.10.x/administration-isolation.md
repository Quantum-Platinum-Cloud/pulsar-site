---
id: administration-isolation
title: Pulsar isolation
sidebar_label: "Pulsar isolation"
original_id: administration-isolation
---

````mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
````


In an organization, a Pulsar instance provides services to multiple teams. When organizing the resources across multiple teams, you want to make a suitable isolation plan to avoid the resource competition between different teams and applications and provide high-quality messaging service. In this case, you need to take resource isolation into consideration and weigh your intended actions against expected and unexpected consequences.

To enforce resource isolation, you can use the Pulsar isolation policy, which allows you to allocate resources (**broker** and **bookie**) for the namespace.

## Broker isolation

In Pulsar, when namespaces (more specifically, namespace bundles) are assigned dynamically to brokers, the namespace isolation policy limits the set of brokers that can be used for assignment. Before topics are assigned to brokers, you can set the namespace isolation policy with a primary or a secondary regex to select desired brokers.

You can set a namespace isolation policy for a cluster using one of the following methods. 

````mdx-code-block
<Tabs 
  defaultValue="Admin CLI"
  values={[{"label":"Admin CLI","value":"Admin CLI"},{"label":"REST API","value":"REST API"},{"label":"Java admin API","value":"Java admin API"}]}>

<TabItem value="Admin CLI">

```

pulsar-admin ns-isolation-policy set options

```

For more information about the command `pulsar-admin ns-isolation-policy set options`, see [Pulsar admin doc](pathname:///reference/#/@pulsar:version_origin@/pulsar-admin).

**Example**

```shell

bin/pulsar-admin ns-isolation-policy set \
--auto-failover-policy-type min_available \
--auto-failover-policy-params min_limit=1,usage_threshold=80 \
--namespaces my-tenant/my-namespace \
--primary 10.193.216.*  my-cluster policy-name

```

</TabItem>
<TabItem value="REST API">

[PUT /admin/v2/namespaces/{tenant}/{namespace}](pathname:///admin-rest-api/?version=@pulsar:version_number@&apiversion=v2#operation/createNamespace)

</TabItem>
<TabItem value="Java admin API">

For how to set namespace isolation policy using Java admin API, see [here](https://github.com/apache/pulsar/blob/master/pulsar-client-admin/src/main/java/org/apache/pulsar/client/admin/internal/NamespacesImpl.java#L251).

</TabItem>

</Tabs>
````

## Bookie isolation

A namespace can be isolated into user-defined groups of bookies, which guarantees all the data that belongs to the namespace is stored in desired bookies. The bookie affinity group uses the BookKeeper [rack-aware placement policy](https://bookkeeper.apache.org/docs/latest/api/javadoc/org/apache/bookkeeper/client/EnsemblePlacementPolicy.html) and it is a way to feed rack information which is stored as JSON format in znode.

You can set a bookie affinity group using one of the following methods.

````mdx-code-block
<Tabs 
  defaultValue="Admin CLI"
  values={[{"label":"Admin CLI","value":"Admin CLI"},{"label":"REST API","value":"REST API"},{"label":"Java admin API","value":"Java admin API"}]}>

<TabItem value="Admin CLI">

```

pulsar-admin namespaces set-bookie-affinity-group options

```

For more information about the command `pulsar-admin namespaces set-bookie-affinity-group options`, see [Pulsar admin doc](pathname:///reference/#/@pulsar:version_origin@/pulsar-admin).

**Example**

```shell

bin/pulsar-admin bookies set-bookie-rack \
--bookie 127.0.0.1:3181 \
--hostname 127.0.0.1:3181 \
--group group-bookie1 \
--rack rack1

bin/pulsar-admin namespaces set-bookie-affinity-group public/default \
--primary-group group-bookie1

```

:::note

- Do not set a bookie rack name to slash (`/`) or an empty string (`""`) if you use Pulsar earlier than 2.7.5, 2.8.3, and 2.9.2. If you use Pulsar 2.7.5, 2.8.3, 2.9.2 or later versions, it falls back to `/default-rack` or `/default-region/default-rack`.
- When `RackawareEnsemblePlacementPolicy` is enabled, the rack name is not allowed to contain slash (`/`) except for the beginning and end of the rack name string. For example, rack name like `/rack0` is okay, but `/rack/0` is not allowed.
- When `RegionawareEnsemblePlacementPolicy` is enabled, the rack name can only contain one slash (`/`) except for the beginning and end of the rack name string. For example, rack name like `/region0/rack0` is okay, but `/region0rack0` and `/region0/rack/0` are not allowed.
For the bookie rack name restrictions, see [pulsar-admin bookies set-bookie-rack](pathname:///reference/#/@pulsar:version_origin@/pulsar-admin/bookies?id=set-bookie-rack).

:::

</TabItem>
<TabItem value="REST API">

[POST /admin/v2/namespaces/{tenant}/{namespace}/persistence/bookieAffinity](pathname:///admin-rest-api/?version=@pulsar:version_number@&apiversion=v2#operation/setBookieAffinityGroup)

</TabItem>
<TabItem value="Java admin API">

For how to set bookie affinity group for a namespace using Java admin API, see [here](https://github.com/apache/pulsar/blob/master/pulsar-client-admin/src/main/java/org/apache/pulsar/client/admin/internal/NamespacesImpl.java#L1164).

</TabItem>

</Tabs>
````
