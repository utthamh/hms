using ZS.DotNet.Tutorial.API;
using ZS.OE.Core.Commons.Hosts.Common;

namespace ZS.DotNet.Tutorial.Hosts.Local
{
    public class Program
    {
        public static void Main(string[] args)
        {
            LocalHost.Run<Startup>(args);
        }

    }
}
