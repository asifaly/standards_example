const ListComponent = (rowValues: Record<string, any>) => {
    return (
        <div>
            {
                rowValues?.data?.map((ls:any, index:number) => (
                    <div className={`flex items-center space-x-2 ${index !== rowValues?.data?.length - 1 && "mb-2"}`} key={index}>
                        <div className="w-[5px] h-[5px] bg-[#4E6ACB] rounded-[50%]"></div>
                        <p>{ls?.label}</p>
                    </div>
                ))
            }
        </div>
    )
}
export default ListComponent;