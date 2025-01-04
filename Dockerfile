FROM maven:3.8.3-openjdk-17 AS builder

COPY ./src/ /root/src
COPY ./pom.xml /root/
WORKDIR /root
RUN mvn package
RUN java -Djarmode=layertools -jar /root/target/device-management-microservice-0.0.1-SNAPSHOT.jar list
RUN java -Djarmode=layertools -jar /root/target/device-management-microservice-0.0.1-SNAPSHOT.jar extract
RUN ls -l /root

FROM openjdk:17-jdk-slim

ENV TZ=UTC
ENV DB_IP=sd-device-management-osvat-sergiu.mysql.database.azure.com
ENV DB_PORT=3306
ENV DB_DBNAME=device_db
ENV DB_USER=Sergiu27
ENV DB_PASSWORD=Root1234

COPY --from=builder /root/dependencies/ ./
COPY --from=builder /root/snapshot-dependencies/ ./


RUN sleep 10
COPY --from=builder /root/spring-boot-loader/ ./
COPY --from=builder /root/application/ ./

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher","-XX:+UseContainerSupport -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -Xms512m -Xmx512m -XX:+UseG1GC -XX:+UseSerialGC -Xss512k -XX:MaxRAM=72m"]