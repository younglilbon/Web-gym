import Image from "next/image";

export default function InstructorAvatar() {
  return (
    <Image
      className="training-instructor-avatar"
      src="/images/anh-tuan-avatar.png"
      alt="Ảnh đại diện giảng viên Anh Tuấn"
      width={768}
      height={768}
    />
  );
}
