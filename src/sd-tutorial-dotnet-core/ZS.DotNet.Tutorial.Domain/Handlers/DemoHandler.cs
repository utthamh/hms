//using ZS.DotNet.Tutorial.Data.Repository;

using System.Collections.Generic;
using System.Linq;
using ZS.DotNet.Tutorial.Data.Repository;
using ZS.DotNet.Tutorial.Model;

namespace ZS.DotNet.Tutorial.Domain.Handlers
{
    public class DemoHandler : IDemoHandler
    {
        private readonly IDemoRepository _demoRepository;
        public DemoHandler(IDemoRepository demoRepository)
        {
            _demoRepository = demoRepository;
        }


        public IList<Dummy> GetAllRecord()
        {
            return _demoRepository.GetAll().ToList();
        }

        public Dummy AddEntry(Dummy dummy)
        {
            return _demoRepository.Add(dummy);
        }
        public Dummy Update( Dummy dummy)
        {
            return _demoRepository.Update(dummy);
        }
        public Dummy GetDummy()
        {
            return new Dummy()
            {
                Id = 1,
                Name = "Dummy Data"
            };
        }
    }
}
