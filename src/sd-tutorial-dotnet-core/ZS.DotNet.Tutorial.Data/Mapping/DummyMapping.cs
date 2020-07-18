using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ZS.DotNet.Tutorial.Model;

namespace ZS.DotNet.Tutorial.Data.Mapping
{
    public class DummyMapping : IEntityTypeConfiguration<Dummy>
    {
        public void Configure(EntityTypeBuilder<DotNet.Tutorial.Model.Dummy> builder)
        {
            builder.ToTable("dummy");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("Id").ValueGeneratedOnAdd();
            builder.Property(e => e.Name).HasColumnName("Name");



        }

       
    }
}
