import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { toast } from "sonner";
import { apiGetDriverProfile, apiUpdateDriverProfile } from "../../services/DriverAPI";

export function ProfilePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [profile, setProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGetDriverProfile();
        setProfile(data);
      } catch (error) {
        toast.error("Không thể tải thông tin profile");
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      await apiUpdateDriverProfile(profile);   
      toast.success("Cập nhật hồ sơ thành công!");
      onNavigate("/driver/dashboard");
    } catch (error) {
      toast.error("Lỗi khi lưu profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return <div className="p-6 text-center">Đang tải thông tin...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card className="p-6 rounded-2xl space-y-4">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin cá nhân</h2>

        <div>
          <label className="text-sm font-medium">Tên</label>
          <Input
            value={profile.userAccount.name}
            onChange={(e) =>
              setProfile({ ...profile, userAccount: { ...profile.userAccount, name: e.target.value } })
            }
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <Input 
            disabled 
            value={profile.userAccount.email} 
            className="mt-1 bg-gray-50"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Số điện thoại</label>
          <Input
            value={profile.phoneNumber || ""}
            onChange={(e) =>
              setProfile({ ...profile, phoneNumber: e.target.value })
            }
            placeholder="Nhập số điện thoại"
            className="mt-1"
            maxLength={11}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          <Button variant="outline" onClick={() => onNavigate("/driver/dashboard")}>
            Hủy
          </Button>
        </div>
      </Card>
    </div>
  );
}