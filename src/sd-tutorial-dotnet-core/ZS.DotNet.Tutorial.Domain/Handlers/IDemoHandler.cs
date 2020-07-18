using System.Collections.Generic;
using ZS.DotNet.Tutorial.Model;

namespace ZS.DotNet.Tutorial.Domain.Handlers
{
    public interface IDemoHandler
    {
        Dummy GetDummy();
        Dummy AddEntry(Dummy dummy);

        IList<Dummy> GetAllRecord();

        Dummy Update(Dummy dummy);

    }
}
