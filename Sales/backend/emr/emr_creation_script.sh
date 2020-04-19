aws emr create-cluster 
--release-label emr-5.29.0
--instance-groups InstanceGroupType=MASTER,InstanceCount=1,InstanceType=m4.xlarge InstanceGroupType=CORE,InstanceCount=1,InstanceType=m4.xlarge 
--use-default-roles 
--ec2-attributes SubnetIds=subnet-YOUR_SUBNET,KeyName=YOUR_KEY 
--applications Name=Spark Name=Hadoop
--name="SD tutorial clusters"
--log-uri s3://YOUR_BUCKET 
--steps Type=CUSTOM_JAR,Name=CustomJAR,ActionOnFailure=CONTINUE,Jar=s3://REGION.elasticmapreduce/libs/script-runner/script-runner.jar,Args=["s3://YOUR_BUCKET/YOUR_SHELL_SCRIPT.sh"]