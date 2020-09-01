import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.Function;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.lang.String;


public class sparkApp {
    public static void main(String[] args) throws IOException {
        SparkConf sparkConf = new SparkConf()
                .setAppName("mysparkapp");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        String filePath=args[0];
        String finalFile=args[1];
        //String fileName=args[2];
        JavaRDD<String> reader = sparkContext.textFile(filePath);
        long lineCount=reader.count();
        List<String> lines=new ArrayList<String>(reader.collect());
        lines.add("Numbers of lines : "+lineCount);
        JavaRDD<String> writer= sparkContext.parallelize(lines);
        writer.repartition(1).map(new Function<String, Object>() {
            public Object call(String x) throws Exception {
                return x.replace("a", "*");
            }
        }).saveAsTextFile(finalFile);
        System.out.println("Number of lines in file = " + lineCount);
        sparkContext.stop();
    }
}
